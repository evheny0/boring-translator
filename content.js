class Translator {
  constructor() {
    this.url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ru&dt=t&q=";
    this.createTranslateBox();
    this.wireListeners();
  }

  createTranslateBox() {
    this.translateBox = document.createElement("div");
    this.translateBox.id = "translate-box";
    this.translateBox.className = "translate-box translate-box_hidden";
    this.translateBox.innerHTML = "<div class='translate-box__container'><p class='translate-box__text'>Hello!</p><span class='translate-box__close'>&times;</span></div>";
    document.body.appendChild(this.translateBox);
  };

  wireListeners() {
    this.addDismissListener();
    window.ondblclick = this.onTranslate.bind(this);
  }

  addDismissListener() {
    this.translateBox.addEventListener('click', this.hideTranslateBox.bind(this));
  }

  onTranslate(event) {
    if (!window.event.ctrlKey) {
      return;
    }

    let sourceText = window.getSelection().toString();
    let xhr = this.buildAndSendRequest(sourceText);
    xhr.onreadystatechange = () => {
      this.showTranslateBox('...', event);
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          this.showTranslateBox(eval(xhr.responseText)[0][0][0], event);
        } else {
          this.showTranslateBox("Error", event);
        }
      }
    };
  }

  showTranslateBox(text, event) {
    this.translateBox.classList.remove("translate-box_hidden");
    this.translateBox.style.left = event.pageX + "px";
    this.translateBox.style.top = event.pageY + 10 + "px";
    this.translateBox.firstChild.firstChild.innerHTML = text;
  }

  hideTranslateBox() {
    this.translateBox.classList.add("translate-box_hidden")
  }

  buildAndSendRequest(text) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', this.url + encodeURI(text));
    xhr.send(null);
    return xhr;
  }
}

new Translator();
