interface EditorState {
  onInput(text: string): EditorState;
  onSave(editor: TextEditor): EditorState;
  onSaveAs(editor: TextEditor): EditorState;
  onNew(editor: TextEditor): EditorState;
}

class CleanUnsaved implements EditorState {
  onInput(): EditorState { return new DirtyUnsaved(); }
  onSave(editor: TextEditor): EditorState {
    const name = prompt("Enter a File Name", "") || "";
    return editor.saveTo(name) ? new CleanSaved(name) : this;
  }
  onSaveAs(editor: TextEditor): EditorState { return this.onSave(editor); }
  onNew(editor: TextEditor): EditorState {
    editor.reset(); return new CleanUnsaved();
  }
}

class CleanSaved implements EditorState {
  constructor(private filename: string) {}
  onInput(): EditorState { return new DirtySaved(this.filename); }
  onSave(editor: TextEditor): EditorState {
    editor.saveTo(this.filename); return this;
  }
  onSaveAs(editor: TextEditor): EditorState {
    const name = prompt("Enter a File Name", "") || "";
    return editor.saveTo(name) ? new CleanSaved(name) : this;
  }
  onNew(editor: TextEditor): EditorState {
    editor.reset(); return new CleanUnsaved();
  }
}

class DirtyUnsaved implements EditorState {
  onInput(): EditorState { return this; }
  onSave(editor: TextEditor): EditorState {
    const name = prompt("Enter a File Name", "") || "";
    return editor.saveTo(name) ? new CleanSaved(name) : this;
  }
  onSaveAs(editor: TextEditor): EditorState { return this.onSave(editor); }
  onNew(editor: TextEditor): EditorState {
    editor.reset(); return new CleanUnsaved();
  }
}

class DirtySaved implements EditorState {
  constructor(private filename: string) {}
  onInput(): EditorState { return this; }
  onSave(editor: TextEditor): EditorState {
    editor.saveTo(this.filename); return new CleanSaved(this.filename);
  }
  onSaveAs(editor: TextEditor): EditorState {
    const name = prompt("Enter a File Name", "") || "";
    return editor.saveTo(name) ? new CleanSaved(name) : this;
  }
  onNew(editor: TextEditor): EditorState {
    editor.reset(); return new CleanUnsaved();
  }
}

class TextEditor {
  private state: EditorState = new CleanUnsaved();
  private currentFile?: string;
  private textArea = document.getElementById("text") as HTMLTextAreaElement;
  constructor() {
    this.attach();
    this.renderState();
  }
  private attach() {
    this.textArea.addEventListener("input", () => {
      this.state = this.state.onInput(this.textArea.value);
      this.renderState();
    });
    document.getElementById("save-button")!.addEventListener("click", () => {
      this.state = this.state.onSave(this);
      this.renderState();
    });
    document.getElementById("save-as-button")!.addEventListener("click", () => {
      this.state = this.state.onSaveAs(this);
      this.renderState();
    });
    document.getElementById("new-button")!.addEventListener("click", () => {
      this.state = this.state.onNew(this);
      this.renderState();
    });
  }
  public saveTo(name: string): boolean {
    if (!name.trim()) return false;
    const fn = name.endsWith(".txt") ? name : `${name}.txt`;
    localStorage.setItem(fn, this.textArea.value);
    this.currentFile = fn;
    this.renderFiles();
    return true;
  }
  public reset() {
    this.textArea.value = "";
    this.currentFile = undefined;
    this.renderFiles();
  }
  private renderState() {
    const label = document.getElementById("state-label")!;
    label.innerText = this.currentFile ? this.currentFile : "_";
  }
  private renderFiles() {
    const ul = document.getElementById("files-list")!;
    ul.replaceChildren();
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)!;
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.innerText = key;
      a.onclick = () => {
        this.textArea.value = localStorage.getItem(key) || "";
        this.currentFile = key;
        this.state = new CleanSaved(key);
        this.renderState();
      };
      li.append(a);
      ul.append(li);
    }
  }
}

document.addEventListener("DOMContentLoaded", () => new TextEditor());
