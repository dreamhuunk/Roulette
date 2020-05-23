class RouleteConstant {

    static casinoNameTaken(){
        return 1001;
    }

    static casinoNotFound(){
        return 1002;
    }
    
    static nameTakenMsg(){
        return "Casino name is already taken";
    }

    static casinoNotFoundMsg(){
        return "Casino doesn't exist";
    }

}

module.exports = RouleteConstant;