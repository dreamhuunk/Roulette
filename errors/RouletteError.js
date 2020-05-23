class  RouletteError extends Error {  
    constructor (message,status) {
      super(message);
  
      this.name = this.constructor.name;
      this.status = status;
    }
  
    get statusCode() {
      return this.status;
    }

    get errorMessage(){
      return this.message;
    } 
  }
  
  module.exports = RouletteError;