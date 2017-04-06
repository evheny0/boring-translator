class Translator {
  constructor() {
    this.url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ru&dt=t&q=";
    this.createTranslateBox();
    this.wireListeners();
  }

  createTranslateBox() {
    let translateBox = document.createElement("div");
    translateBox.id = "translate-box";
    translateBox.className = "translate-box translate-box_hidden";
    translateBox.innerHTML = "<div class='translate-box__container'><p class='translate-box__text'>Hello!</p><span class='translate-box__close'>&times;</span></div>";
    document.body.appendChild(translateBox);
  };

  wireListeners() {
    this.addDismissListener();
    window.ondblclick = this.onTranslate.bind(this);
  }

  addDismissListener() {
    let dismissBox = function() { this.classList.add("translate-box_hidden") };
    document.getElementById("translate-box").addEventListener('click', dismissBox);
  }

  onTranslate(event) {
    if (!window.event.ctrlKey) {
      return;
    }
    let sourceText = window.getSelection().toString();
    let xhr = this.buildAndSendRequest(sourceText);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        this.showTranslateBox('...', event);
        if (xhr.status === 200) {
          this.showTranslateBox(eval(xhr.responseText)[0][0][0], event);
        } else {
          this.showTranslateBox("Error", event);
        }
      }
    };
  }

  showTranslateBox(text, event) {
    let box = document.getElementById("translate-box");
    box.classList.remove("translate-box_hidden");
    box.style.left = event.pageX + "px";
    box.style.top = event.pageY + 10 + "px";
    box.firstChild.firstChild.innerHTML = text;
  }

  buildAndSendRequest(text) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', this.url + encodeURI(text));
    xhr.send(null);
    return xhr;
  }
}

new Translator();
