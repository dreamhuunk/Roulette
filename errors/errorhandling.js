class RouleteConstant {

    static nameTakenMsg(){
        return "Casino name is already taken";
    }

    static casinoNotFoundMsg(){
        return "Casino doesn't exist";
    }

    static dealerNotFound() {
        return "Dealer doesn't exist";
    }

    static gameNotFound() {
        return "Game doesn't exist";
    }

    static dealerGameCasinoMismatch() {
        return "Dealer and Game belongs to different casinos";
    }

    static incorrectAction() {
        return "Please specify a valid action";
    }

    static gameAlreadyStopped() {
        return "Games has been already stopped";
    }

    static gameIsStillInProgress() {
        return "Game is still in progress, please stop and then throw number";
    }


    static gameAlreadyEnded() {
        return "Game has already Ended";
    }

}

module.exports = RouleteConstant;