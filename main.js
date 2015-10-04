var Watcher = function () {

    var self = this;
    var widthBuffer = 0;
    var container = document.createElement("div");
    container.classList.add("watcher-container");
    container.classList.add("active");
    var body = document.querySelector("body");
    var border = document.createElement("div");
    border.classList.add("watcher-container-border");
    border.addEventListener("mousedown", ClickDownBorder);
    border.addEventListener("mouseup", ClickUpBorder);
    var elementBurgerMenu = document.createElement("div");
    elementBurgerMenu.classList.add("watcher-burger-menu");
    elementBurgerMenu.addEventListener("click",ClickBurgerMenu);

    container.appendChild(elementBurgerMenu);
    body.appendChild(container);
    var containerList = document.createElement("ul");
    container.appendChild(border);
    container.appendChild(containerList);
    var elements = [];
    this.flag = false;

    (function () {
        var ua = navigator.userAgent;
        if(ua.search("Firefox") > -1)
            self.flag = true;
        else
            alert("Ваш браузер не потдерживается! Потдерживается только Firefox");
    })();
    /**
     *
     * @param {Object} obj
     * @param {string} prop
     */
    this.addItem = function (obj, prop) {
        if(this.flag) {
            var element = document.createElement("li");
            var elementName = document.createElement("span");
            var elementValue = document.createElement("span");
            containerList.appendChild(element);
            elementName.classList.add("watcher-item-name");
            elementValue.classList.add("watcher-item-value");
            element.appendChild(elementName);
            element.appendChild(elementValue);
            elementName.textContent = prop + ": ";
            elementValue.textContent = obj[prop];
            var objElement = {
                element: element,
                name: elementName,
                value: elementValue
            };
            elements[prop] = objElement;
            obj.watch(prop, function (id, pre, post) {
                elements[id].value.textContent = post;
            });
        }
    };
    /**
     *
     * @param {Object} obj
     * @param {string} [name]
     */
    this.addItems = function (obj, name) {
        if(this.flag) {
            var separator = document.createElement("li");
            separator.classList.add("separator");
            if(name)
                separator.textContent = name;
            elements[obj].push(separator);
            for(var item in obj)
            {
                self.addItem(obj, item);
            }
        }
    };
    /**
     *
     * @param {Object} obj
     * @param {string} field
     */
    this.removeItem = function (obj, field){
        if(this.flag) {
            var index = 0;
            var domElements = document.querySelectorAll(".watcher-container>ul>li");
            for(var item in domElements){
                if(domElements[item] == elements[field].element) {
                    domElements.removeChild(item);
                    break;
                }
            }
            for(var item in elements){
                if(item == field){
                    elements.splice(index,1);
                    break;
                }
                index++;
            }
            obj.unwatch(field);
        }
    };
    /**
     *
     * @param {object} obj
     */
    this.removeItems = function (obj) {
        if(self.flag){
            for(var key in obj){
                self.removeItem(obj, key);
            }
        }
    };
    function ClickDownBorder(event){
        document.addEventListener("mousemove",ResizeField);
    }
    function ClickUpBorder(event){
        document.removeEventListener("mousemove",ResizeField);
    }

    function ResizeField(event){
        var width = window.innerWidth - event.pageX;
        container.style.width = width+"px";
    }
    function ClickBurgerMenu(event){
        var activeFlag = false;
        for(var i = 0; i < container.classList.length; i++){
            if(container.classList[i] == "active") {
                activeFlag = true;
                break;
            }
        }
        if(activeFlag) {
            container.classList.remove("active");
            widthBuffer = container.style.width;
            container.style.width = "30px";
        }else{
            container.classList.add("active");
            container.style.width = widthBuffer;
        }
    }
};

var watcher = new Watcher();

var testObject = {
  field1: "alex"
};

watcher.addItem(testObject, "field1");