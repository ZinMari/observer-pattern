class Observer {
    update(observablse){
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
            observer.update(this);
        })
    }
}

class Publisher extends Observable{
    #posts = [];
    #name = null;
    #publisherBtn = null;
    #publisherForm = null;
    #textarea = null;

    constructor(name){
        super();
        this.#name = name;
        this.#publisherForm = document.forms[name];
        this.#publisherBtn = this.#publisherForm.querySelector('.publishers__btn');
        this.#textarea = this.#publisherForm.querySelector('.publishers__field');

        this.#publisherBtn.addEventListener('click', ()=> {
            this.addPost(this.#textarea.value)
        })
    }

    addPost(text){
        this.#posts.push(text)
        this.notifyObservers();
        this.#textarea.value = ''

    }

    getPosts(){
        return this.#posts;
    }

    getName(){
        return this.#name;
    }
}

class Reader extends Observer {
    #readerBlock = null;
    #newyorkBtn = null;
    #washingtonBtn = null;
    #newyorkDetails = null;
    #washingtonDetails = null;
    #saveBtnText = '';


    constructor(id) {
        super();
        this.#readerBlock = document.getElementById(id);
        this.#newyorkBtn = this.#readerBlock.querySelector('.newyorkSubscribeBtn');
        this.#washingtonBtn = this.#readerBlock.querySelector('.washingtonSubscribeBtn');
        this.#newyorkDetails = this.#readerBlock.querySelector('.newyorkDetails');
        this.#washingtonDetails = this.#readerBlock.querySelector('.washingtonDetails');
    }

    update(publisher){
        const postString = publisher.getPosts().map(post => `<p>${post}</p>`).join('');
        switch(publisher.getName()) {
            case "newyork":  {
                const publisherAreaContent = this.#newyorkDetails.querySelector('.readers__publisher-content');
                publisherAreaContent.innerHTML = postString;
                break;
            }
            case "washington":  {
                const publisherAreaContent = this.#washingtonDetails.querySelector('.readers__publisher-content');
                publisherAreaContent.innerHTML = postString;
                break;
            }
            default: break;
        }
        
    }

    subscribe(publisher){
        publisher.attach(this)
        this.update(publisher)
    }

    unsubscribe(publisher){
        publisher.detach(this)
    }

    toggleSubscription(publisher, detailsNode ,btn){
        if(btn.classList.contains('readers__publisher--unsubscribed')){
            detailsNode.querySelector('.readers__publisher-content').innerHTML =''
            detailsNode.classList.add('readers__publisher--unsubscribed')
            detailsNode.removeAttribute('open')
            btn.classList.remove('readers__publisher--unsubscribed')
            btn.innerText = `Subscribe from ${this.#saveBtnText}`
            this.unsubscribe(publisher)
        } else {
            detailsNode.classList.remove('readers__publisher--unsubscribed')
            btn.classList.add('readers__publisher--unsubscribed')
            btn.innerText = `Unsubscribe from ${this.#saveBtnText}`
            this.subscribe(publisher)
        }
    }

    intializePublisher(publisher, publisherName){
        switch(publisherName) {
            case "newyork":  {
                this.#newyorkBtn.addEventListener('click', ()=>{
                    this.#saveBtnText = "New York Times"
                    this.toggleSubscription(publisher, this.#newyorkDetails, this.#newyorkBtn)
                });
                break;
            }
            case "washington":  {
                this.#washingtonBtn.addEventListener('click', ()=>{
                    this.#saveBtnText = "Washington"
                    this.toggleSubscription(publisher, this.#washingtonDetails, this.#washingtonBtn)
                });
                break;
            }
            default: break;
        }
    }
}

const newyork = new Publisher('newyork');
const washington = new Publisher('washington');

const reader1 = new Reader("Roma");
const reader2 = new Reader("Vasya");
const reader3 = new Reader("John");

reader1.intializePublisher(newyork, newyork.getName())
reader1.intializePublisher(washington, washington.getName())

reader2.intializePublisher(newyork, newyork.getName())
reader2.intializePublisher(washington, washington.getName())

reader3.intializePublisher(newyork, newyork.getName())
reader3.intializePublisher(washington, washington.getName())