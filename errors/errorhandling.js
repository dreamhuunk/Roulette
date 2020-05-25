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

    static userNameAlreadyTaken() {
        return "User name is already taken";
    }

    static userNotFoundMsg(){
        return "user doesn't exist";
    }

    static userPresentInDifferentCasino() {
        return "You aren't allowed to enter more than one casino at a time";
    }

    static userIsAlreadyPresentInCasino() {
        return "You are already present in the casino";
    }


    static invalidGame() {
        return "Invalid game ID provided";
    }
 
    static cannotBetOnStoppedGame() {
        return "Game isn't accepting any new bet";
    }

    static cannotBetOnCompletedGame() {
        return "Game is already completed please bet on a different game";
    }


    static gameBelongsToDifferentCasino() {
        return "Game belongs to different Casino";
    }

    static userAlreadyBelongToALiveGame() {
        return "User already belong to a live game";
    }

}

module.exports = RouleteConstant;