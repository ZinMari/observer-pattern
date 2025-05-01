class Observer {
    update(){

    }
}

class Observable {
    #observers = [];

    attach(observer) {
        // добавляет наблюдателя
        this.#observers.push(observer)
    }

    detach(observer){
        // удаляет наблюдателя
        this.#observers = this.#observers.filter(o => o !== observer);
    }

    notifyObservers(){
        this.#observers.forEach(observer => {
            observer.update();
        })
    }
}

class Publisher extends Observable{
    #postText = "";
    #textarea = null;

    constructor(name){
        super();
        this.#textarea = document.forms[name].querySelector('textarea');
        this.#textarea.addEventListener('input', (e)=>{
            this.setPostText(e.target.value);
        })
    }

    setPostText(text){
        this.#postText = text;
        this.notifyObservers();
    }

    getPostText(){
        return this.#postText;
    }
}

class Reader extends Observer {
    #contentArea = null;
    #publisher = null;

    constructor(id) {
        super();
        this.#contentArea = document.getElementById(id).querySelector('.readers__publisher-content');
    }

    update(){
        this.#contentArea.innerHTML = this.#publisher.getPostText();
    }

    subscribe(publisher){
        this.#publisher = publisher;
    }

    unsubscribe(){
        this.#publisher = null;
    }
}

const newyourk = new Publisher('newyourk');

const reader1 = new Reader("Roma");
const reader2 = new Reader("Vasya");
const reader3 = new Reader("John");

newyourk.attach(reader1);
reader1.subscribe(newyourk)

newyourk.attach(reader2);
reader2.subscribe(newyourk)

newyourk.attach(reader3);
reader3.subscribe(newyourk)

newyourk.detach(reader2);
reader2.unsubscribe();