// client-side js
// run by the browser each time your view template is loaded

// by default, you've got jQuery,
// add other scripts at the bottom of index.html

$(function() {
 
 // model
 var data = {
     init: function(){
 
       this.data  = [];
       this.operations  = [];
       this.lastEntry;
     }, 
     keypad: {  
                          0:{v: 'AC', type: "operators", style: "single", pos: "long", custom: ""},
                          1:{v: 'CE', type: "operators", style: "single", pos: "long", custom: ""},
                          2:{v: '/', type: "operators", style: "single", pos: "long", custom: ""},
                          3:{v: '*', type: "operators", style: "single", pos: "long", custom: ""},
                          4:{v: 7, type: "digit", style: "single", pos: "long", custom: ""},
                          5:{v: 8, type: "digit", style: "single", pos: "long", custom: ""},
                          6:{v: 9, type: "digit", style: "single", pos: "long", custom: ""},
                          7:{v: '-', type: "operators", style: "single", pos: "long", custom: ""},
                          8:{v: 4, type: "digit", style: "single", pos: "long", custom: ""},
                          9:{v: 5, type: "digit", style: "single", pos: "long", custom: ""},
                          10:{v: 6, type: "digit", style: "single", pos: "long", custom: ""},
                          11:{v: '+', type: "operators", style: "single", pos: "long", custom: ""},
                          12:{v: 1, type: "digit", style: "single", pos: "long", custom: ""},
                          13:{v: 2, type: "digit", style: "single", pos: "long", custom: ""}, 
                          14:{v: 3, type: "digit", style: "single", pos: "long", custom: ""}, 
                          15:{v: '=', type: "operators", style: "double yellow ", pos: "long", custom: ""},
                          16:{v: 0, type: "digit", style: "double", pos: "lat", custom: " zero "}, 
                          17:{v: '.', type: "digit", style: "single", pos: "long", custom: " point "},   
              },
     getkeypad: function(){
          return this.keypad;
     }
       
 };

 //controller
    var octopus = {
        init: function() {
            data.init();
            view.init();
        },
        tempValue:0,
        addEntry: function(v, operator) {
            
            if( v === 'CE'){
               (data.operations.pop());
            }
            else if (v === "=" && data.operations.length > 0) {
                  (this.sum());   
            } else {
                if (data.operations.length > 0 // array > 0
                    &&
                    (Array.isArray(data.operations[(data.operations.length - 1)]) === false)) { //last entry is not array
                    if (operator) { //if new entry is an operator
                        data.operations.push([v]);
                    } else {
                        data.operations[(data.operations.length - 1)] = data.operations[(data.operations.length - 1)].toString() + v.toString();
                    }
                } else {

                    if(v === "."){
                          v = '0' + v.toString();
                    }
                  
                    operator && v !== 0 ? data.operations[(data.operations.length - 1)] = ([v]) : data.operations.push(v);
                }
            }
        },
        getOperation: function(v) {
            if( v === 'AC'){
              data.init();
            }else if(v === '='){
              return this.tempValue;          
            }else if (data.operations.length > 0) {
                if (Array.isArray(data.operations[(data.operations.length - 1)])) {
                    return data.operations[data.operations.length - 1];
                } else {
                    return data.operations[data.operations.length - 1];
                }
            } else {
                return "";
            }
        },
        getEntries: function() {
            var tickerString = data.operations.map(function(v, i) {
                v = Array.isArray(v) ? v[0] : v;
                return v;
            });
            return tickerString.join(" ")
        },
        sum: function(v) {
            var expression = data.operations.map(function(v, i) {
                v = Array.isArray(v) ? v[0] : v;
                return v;
            }); 
            console.log(expression)
            this.tempValue = eval(expression.join(" "));

        }
    };

    // html view 
    var view = {

        init: function() {
            this.displayKeypad();
        },
        handle: '.operator',
        screen: '.screen',
        notifier: '.notify',
        ticker: '.ticker',
        notify: function(msg) {},
        displayKeypad: function() {

            var keypad = data.getkeypad();
            var html = '';
            for (var i = 0; i < Object.keys(keypad).length; i++) {
                var key = Object.keys(keypad)[i];
                html += '<div class="'  + keypad[key].custom + '"><button data-v="' + keypad[key].v + '" class="keypad ' + keypad[key].type + ' ' + keypad[key].pos + ' ' + keypad[key].style + '" >' + keypad[key].v + '</button></div>';
            };

            $(this.handle).append(html);
            $(this.handle).find('.keypad').on({
                'click': function(e) {
                    e.preventDefault();
                    octopus.addEntry($(this).text(), $(this).hasClass('operators'));

                    // update screen
                     view.displayScreen(octopus.getOperation($(this).text()));
                     view.updateTicker();
                }
            });

        },
        displayScreen: function(entry) {
            $(this.screen).val(entry);
        },
        updateTicker: function() {
            $(this.ticker).text(octopus.getEntries());
        }
    };

    octopus.init();

});