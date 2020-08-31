var dataModule = (function(){
    var lineReturn = '|';
    //shuffle words function 
    var shuffle = function(array){
        var newArray = [];
        var randomIndex;
        var randomElement
        while(array.length > 0){
            randomIndex = Math.floor(Math.random()*array.length);
            randomElement = array[randomIndex];
            newArray.push(randomElement);
            array.splice(randomIndex,1);

        }  
        return newArray;
    };
    String.prototype.capitalize = function(){
        var newString = "";
        var firstCharCap = this.charAt(0).toUpperCase();
        var remainingChar = this.slice(1);
        newString = firstCharCap + remainingChar;
        return newString;
    };
    //capitalise random strings function 
    var capitaliseRandom = function(arrayOfStrings){
        
        return arrayOfStrings.map(function(currentWord){
            var x = Math.floor(4 * Math.random());//chances of x equal to 3: 25%
            return (x == 3)?currentWord.capitalize():currentWord;
        })
    };

  
    //add a random punctuation function
    var addRandomPunctuation = function(arrayOfString){
        return arrayOfString.map(function(currentWord){
            var addRandomPunctuation;
            var items = [lineReturn,'?',',','.','!',''];
            var randomIndex = Math.floor(Math.random() * items.length);
            randomPunctuation = items[randomIndex];
            return currentWord + randomPunctuation;
        });
    };
    //character call back used to calu the number of 
    var nbCorrectChar;
    var charCallback = function(currentElement,index){
        nbCorrectChar += (currentElement == this.characters.user[index])? 1:0;
        
    };
    
    var appData = {
        indicators: {
            testStarted:false, testEnded: false, totalTestTime: 0,timeleft: 0,textNumber:0
        },
        results:{
            wpm: 0, wpmChange: 0, cpm: 0, cpmChange: 0, accuracy: 0, accuracyChange: 0, numOfCorrectWords: 0,numberOfCorrectCharacters: 0,
            numOfTestCharacters: 0
           
        },
        words: {
            currentWordIndex: -1,testWords: [],currentWord: {}
        },
        
    };

    //word constructor
    //   {
    //       value:{correct:'',user:'',isCorrect:false},
    //       characters:{correct:[],user:[],totalCorrect:0,totalTest:0}
    //   }
    var word = function(index){
        //word values : correct vs user's 
        //character values : correct vs user's 

        this.value = {
            correct: appData.words.testWords[index] + ' ',
            user:'',
            isCorrect:false,
        };
        this.characters = {
            // correct:value.split(''),
            correct: this.value.correct.split(''),
            user:[],
            totalCorrect: 0,
            totalTest: this.value.correct.length,
        };
    };
    word.prototype.update = function(value){
        //update the user value
        this.value.user = value;
        //update the words status(correct or not)
        this.value.isCorrect = (this.value.correct == this.value.user);
        //update user character 
        this.characters.user = this.value.user.split('');
        // calculate the number of correct characters 
        //correct : ['w','w']
        nbCorrectChar = 0;
        var charCallback2 = charCallback.bind(this); 
        this.characters.correct.forEach(charCallback2);
        this.characters.totalCorrect = nbCorrectChar;

         


    };
    // var word = function(index){};

    //update method
    // word.prototype.update = funciton(value){};

    return {
    //indicators - test Control
        //sets the total test time to x 
        setTestTime: function(x){
            appData.indicators.totalTestTime = x;


        },
        initializeTimeLeft: function(){
            appData.indicators.timeleft = appData.indicators.totalTestTime
        }, //initializes time left to the total test time 
        startTest: function(){
            appData.indicators.testStarted = true;
        }, //start the test
        endTest: function(){
            appData.indicators.testEnded = true;
        }, // ends the test 
        getTimeLeft: function(){
            return appData.indicators.timeleft;
        }, //return the remaining test time
        reduceTime: function(){
            appData.indicators.timeleft --;
            return appData.indicators.timeleft;
        }, //reduces the time by one sec
        timeleft: function(){
            return appData.indicators.timeleft != 0;
        }, // checks if there is time left to continue the test 
        testEnded: function(){
            return appData.indicators.testEnded;
        },//check if the test has already ended
        
        testStarted: function(){
            return appData.indicators.testStarted; 
        },//check if the test has started   

    //results

        calculateWpm: function(){
            var wpmOld = appData.results.wpm;
            var numOfCorrectWords = appData.results.numOfCorrectWords;
            if(appData.indicators.timeleft != appData.indicators.totalTestTime){
                appData.results.wpm = Math.round(60 * numOfCorrectWords/(appData.indicators.totalTestTime - appData.indicators.timeleft));

            }else{
                appData.results.wpm = 0;
            }
            appData.results.wpmChange = appData.results.wpm - wpmOld;

            return [appData.results.wpm,appData.results.wpmChange];
        },//calculates wpm and wpmChange and updates them in appData

        calculateCpm: function(){
            var cpmOld = appData.results.cpm;
            var numOfCorrectCharacters = appData.results.numberOfCorrectCharacters;
            if(appData.indicators.timeleft != appData.indicators.totalTestTime){
                appData.results.cpm = Math.round(60 * numOfCorrectCharacters/(appData.indicators.totalTestTime - appData.indicators.timeleft));

            }else{
                appData.results.cpm = 0;
            }
            appData.results.cpmChange = appData.results.cpm - cpmOld;

            return [appData.results.cpm,appData.results.cpmChange];
        },//calculates cpm and cpmChange and updates them in appData

        //calculates accuracy and accuracyChange and updates them in appData
        calculateAccuracy: function(){

            var accuracyOld = appData.results.accuracy;
            var numOfCorrectCharacters = appData.results.numberOfCorrectCharacters;
            var numOfTestCharacters = appData.results.numOfTestCharacters;
            if(appData.indicators.timeleft != appData.indicators.totalTestTime){
                if(numOfTestCharacters != 0){
                appData.results.accuracy = Math.round(100 * numOfCorrectCharacters/(numOfTestCharacters));
                }
            }else{
                appData.results.accuracy = 0;
            }
            appData.results.accuracyChange = appData.results.accuracy - accuracyOld;

            return [appData.results.accuracy,appData.results.accuracyChange];
        },//calculates accuracy and accuracyChange and updates them in appData

    //test words 
        //fills words.testWords
        fillListOfTestWords:function(textNumber,words){
            var result = words.split(" ");
            if(textNumber == 0){
                //shuffle words
                result = shuffle(result);
                //capitalise random strings 
                result = capitaliseRandom(result);
                //add a random punctuation
                result = addRandomPunctuation(result);
            }
            
            appData.words.testWords = result;
        },
        //get list of test words: words.testWords
        getListofTestWords: function(){

            return appData.words.testWords;
        },
        moveToNewWord: function(){
            if(appData.words.currentWordIndex > -1){

                //update the number of correct words
                if(appData.words.currentWord.value.isCorrect == true){
                    appData.results.numOfCorrectWords ++;
                }
                //update number of correct characters
                appData.results.numberOfCorrectCharacters += appData.words.currentWord.characters.totalCorrect;
                //update number of test characters 
                appData.results.numOfTestCharacters += appData.words.currentWord.characters.totalTest;
            }
            appData.words.currentWordIndex ++;
            var currentIndex = appData.words.currentWordIndex;
            var newWord = new word(currentIndex);
            appData.words.currentWord = newWord;
        },//increments the currentWordIndex -updates the current word (appData.words.currentword) by creating a new instance of the word class - updates numOfCorrectWords, numOfCorrectCharacters and numOfTestCharacters

        //get the current word index
        getCurrentWordIndex: function(){
            return appData.words.currentWordIndex;
        },
        getCurrentWord(){
            var currentWord = appData.words.currentWord;
            return {
                value:{
                    correct:currentWord.value.correct,
                    user:currentWord.value.user
                }
            }
        },
        updateCurrentWord: function(value){
            appData.words.currentWord.update(value);

        },//updates current word using user input 
        
        getLineReturn(){
            return lineReturn;
        },

        returnData(){
            console.log(appData);
            // return appData;
        },
        getCertificateData(){
            return {
                wpm :appData.results.wpm,
                accuracy: appData.results.accuracy
            }
        },
        
        


    } 

    
})(); 