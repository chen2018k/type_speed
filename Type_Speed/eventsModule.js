var eventsModule = (function(dModule,uModule,cModule,wModule){
    var addEventListeners = function(){

        //enter click event 

        uModule.getDOMElements().textInput.addEventListener('keydown',function(event){
            console.log(event);
            if(dModule.testEnded()){
                return ;
            }
            //check if the user pressed Enter
            var key = event.keyCode;
            if(key == 13){
                uModule.getDOMElements().textInput.value += dModule.getLineReturn() + ' ';
                //create a new 'input' event 
                var inputEvent = new Event('input');

                //dispatch it
                uModule.getDOMElements().textInput.dispatchEvent(inputEvent);
            }
        });

        //character typing event listener
        uModule.getDOMElements().textInput.addEventListener('input',function(event){
            console.log(event);
            //if the test ended, do nothing
            if(dModule.testEnded()){
                return ;
            }
            //if the test has not start yet,start the test and countdown
            if(!dModule.testStarted()){
                //start the test :data Module
                dModule.startTest();
                //start counter
                var b = setInterval(function(){
                    //calculate the results :data Module

                        //update wpm
                    var results = {};
                    [results.wpm,results.wpmChange] = dModule.calculateWpm();
                        //update cpm
                    [results.cpm,results.cpmChange] = dModule.calculateCpm();
                        //update accuracy
                    [results.accuracy,results.accuracyChange] = dModule.calculateAccuracy();

                    uModule.updateResults(results);
                    dModule.returnData();
                    // console.log(results)
                    //update results(UI module)

                    //update time left

                    //check if we have time left
                            // reduce time by one sec: data Module

                            //update time remaining in UI

                            //no: 
                            
                            //end the test: data module 
                    if(dModule.timeleft()){
                        var timeleft = dModule.reduceTime();
                        uModule.updateTimeLeft(timeleft);
                    
                    }else{
                        //end the test: data module
                        clearInterval(b);
                        dModule.endTest();
                        //fill modal
                        uModule.fillModal(results.wpm);
                        //show modal
                        uModule.showModal();
                    }
                },1000);
            }
            //get typed word  : UI Module
            var typedWord = uModule.getTypedWord();
            //update current word:data module
            dModule.updateCurrentWord(typedWord);
            //format the active word
            var currentWord = dModule.getCurrentWord();
            uModule.formatWord(currentWord);
            //check if the user pressed space or enter
            if (uModule.spacePressed(event) || uModule.enterPressed(dModule.getLineReturn())){
                //empty text input 
                uModule.emptyInput();
                //deactivate current word 
                uModule.deactivateCurrentWord();

                dModule.moveToNewWord();
            //set the active Word: UI Module
                var index = dModule.getCurrentWordIndex();
                uModule.setActiveWord(index);

            //format the active word: UI Module
                var currentWord = dModule.getCurrentWord();
                uModule.formatWord(currentWord);

                //scroll word into 
                uModule.scroll();

            }
             
        });
        //click on download button event listener 
        uModule.getDOMElements().download.addEventListener('click',function(event){
            if(uModule.isNameEmpty()){
                uModule.flagNameInput();
            }else{
                var certificateData = dModule.getCertificateData();
                cModule.generateCertificate(certificateData);
            }
        });
        //click on restart button event listener
        uModule.getDOMElements().restart.addEventListener('click',function(event){
            location.reload() 
        });
    };

    //scroll active word into middle view on window resize
    window.addEventListener('resize',uModule.scroll); 

    
    return {
        //init function, initializes the test before start  
        init:function(duration, textNumber){
            // fill the list of test word: data Module
           
            var words = wModule.getWords(textNumber);
           
            dModule.fillListOfTestWords(textNumber,words);
            //fill the list of test words: UI Module
            var lineReturn = dModule.getLineReturn();
            var testWords = dModule.getListofTestWords();
            uModule.fillContent(testWords,lineReturn);

            dModule.setTestTime(duration);

            //set the total test time
 
            //update time left : data Module
            dModule.initializeTimeLeft();
            //update time left: UI module
            var timeLeft = dModule.getTimeLeft();
            uModule.updateTimeLeft(timeLeft);
            //move to a new word: data Module
            dModule.moveToNewWord();
            //set the active Word: UI Module
            var index = dModule.getCurrentWordIndex();
            uModule.setActiveWord(index);

            //format the active word: UI Module
            var currentWord = dModule.getCurrentWord();
            uModule.formatWord(currentWord);
            //focus on text input: UI Module
            uModule.inputFocus();
            //add event listener
            addEventListeners(); 
        }
        
    };
    
})(dataModule,UIModule,certificateModule,wordsModule);