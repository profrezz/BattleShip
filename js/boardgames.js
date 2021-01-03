class BoardGames {
    constructor() {
        this.winner = null;
        this.isDesignMode = true;
        this.currentTurn = Player.Decepticon;
        this.countMove = 0;
        this.countMiss = 0;
        this.boards = new Array(25).fill().map( t => new Square() );
        this.shipDeploySlotCount = 4;
        this.shipAlreadyDeploySlotCount = 0;
        this.clickAvailable = true;
        this.boardSlot = 5 * 5;
        this.message = "Design Mode";
        this.result = "";
        this.endpoint = "";
        this.lastPlacementPosition = null;
        this.lastPlacementDirection = null;
    }

    deployBomb(index) {
        console.log("bomb" , index,this.boards[index].available )
        // debugger;
        if( this.checkGamesProgress() && this.boards[index].available){
            this.boards[index].place = this.currentTurn;
            this.boards[index].available = false;
            this.boards[index].isBomb = true;
            this.countMove++;
            this.checkHit(index);
            this.checkWinner();
            this.currentTurn = this.currentTurn === Player.Decepticon ? Player.Autobots : Player.Decepticon;

        }
    }

    checkHit( index ) {
        if(this.boards[index].isShip == true) {
            this.endpoint = "HIT!"
        }else {
            this.countMiss++;
            this.endpoint = "MISS!"
        }
    }

    checkShipPlacemnet( lastindex , index ) {
        if( this.shipAlreadyDeploySlotCount == 3 && this.lastPlacementDirection == "|"){
            if(  
                ( lastindex - 1 == index && (lastindex) % 5 != 0)
                || ( lastindex + 1 == index && (lastindex) % 5 != 4)
                
                ) {
                    return true;
                }
        }else if( this.shipAlreadyDeploySlotCount == 3  && this.lastPlacementDirection == "-") {
            if(  lastindex - 5 == index 
                || lastindex + 5 == index 
                ) {
                return true;
            }
        }else {
            if(  lastindex - 5 == index 
                || lastindex + 5 == index 
                || ( lastindex - 1 == index && (lastindex) % 5 != 0)
                || ( lastindex + 1 == index && (lastindex) % 5 != 4)
                
                ) {
                return true;
            }
        }
        return false;
    }

    designBoard(index) {
        console.log("design"  )

        if( this.checkDesignMode()
            && this.shipAlreadyDeploySlotCount != this.shipDeploySlotCount
            && !this.boards[index].isShip) {

            if( this.lastPlacementDirection == null && this.shipAlreadyDeploySlotCount % 2 == 1 ) {
                if( this.lastPlacementPosition + 1 == index || this.lastPlacementPosition - 1 == index  ) {
               
                    this.lastPlacementDirection = "-"
                }else {
                    this.lastPlacementDirection = "|"
                }
            }
            

            this.lastPlacementPosition = index;
            this.boards[index].isShip = true;
            this.shipAlreadyDeploySlotCount++;

            if(this.lastPlacementPosition != null && this.shipAlreadyDeploySlotCount < 3){
                this.boards.forEach( (sq) => {
                    sq.available = true; 
                })
            }
            
            this.boards.forEach( (sq, innerIndex) => {
               if(this.lastPlacementPosition != null && this.shipAlreadyDeploySlotCount < 2 ) {
                   if(this.checkShipPlacemnet(this.lastPlacementPosition, innerIndex)){
                       this.boards[innerIndex].available = true; 
                   }else{
                       this.boards[innerIndex].available = false; 
                   }
               }
               else if(this.lastPlacementPosition != null && this.shipAlreadyDeploySlotCount == 2 ){
                    if( sq.isShip ) {
                        this.boards[innerIndex].available = false; 
                        if(this.boards[innerIndex - 5 ] != null ) 
                            this.boards[innerIndex - 5 ].available = false; 
                        if(this.boards[innerIndex + 5 ] != null ) 
                            this.boards[innerIndex + 5 ].available = false; 
                       
                        if(innerIndex % 5 != 0){
                            if(this.boards[innerIndex - 1 ] != null ) 
                                this.boards[innerIndex - 1 ].available = false; 
                            if(this.boards[innerIndex - 6 ] != null ) 
                                this.boards[innerIndex - 6 ].available = false; 
                            if(this.boards[innerIndex + 4  ] != null ) 
                                this.boards[innerIndex + 4 ].available = false; 
                        }
                        if(innerIndex % 5 != 4){
                            if(this.boards[innerIndex  + 1 ] != null ) 
                                this.boards[innerIndex + 1].available = false; 
                            if(this.boards[innerIndex + 6 ] != null ) 
                                this.boards[innerIndex + 6].available = false;
                            if(this.boards[innerIndex - 4 ] != null )  
                                this.boards[innerIndex - 4].available = false; 
                        }
                    }
               }else if(this.lastPlacementPosition != null && this.shipAlreadyDeploySlotCount > 2 ) {
                    if(this.boards[innerIndex].available != false 
                        && this.checkShipPlacemnet(this.lastPlacementPosition, innerIndex)){
                        this.boards[innerIndex].available = true; 
                    }else{
                        this.boards[innerIndex].available = false; 
                    }
                }
           })

            if(this.shipAlreadyDeploySlotCount == this.shipDeploySlotCount) {
                this.clickAvailable = false;
                // this.isDesignMode = false;
                // this.message = "Battle Mode";
                
            }
        }
    }

    submitDesign() {
        console.log("submit" )
        this.isDesignMode = false;
        this.message = "Battle Mode";
        this.boards.forEach( (sq) => {
            sq.available = true; 
        })
    }

    clearDesign() {
        console.log("clear" )
        this.boards = new Array(25).fill().map( t => new Square() );
        this.shipAlreadyDeploySlotCount = 0;
        this.isDesignMode = true;
        this.message = "Design Mode";
        this.result = "";
        this.winner = null;
        this.countMiss = 0;
        this.endpoint = "";
        this.lastPlacementPosition = null;
        this.lastPlacementDirection = null;
    }

    checkDesignMode() {
        if( this.isDesignMode ) {
            return true;
        }
        return false;
    }

    resetAvailable() {
        this.boards.forEach(sq => {
            sq.available = true;
        });
    }

    checkWinner() {
        var bombCount = 0;
        this.boards.forEach(sq => {
            if( sq.isBomb == true && sq.isShip == true ) {
                bombCount++;
                if(bombCount == this.shipDeploySlotCount){
                    //win
                    this.winner = this.currentTurn;
                    this.endpoint = "WIN!"
                }
            }
        });
    }

    checkGamesProgress() {
        if( this.winner != null ) {
            this.clickAvailable = false;
            return false;
        }
        if( this.countMove == this.boardSlot){
            this.clickAvailable = false;
            return false;
        }
        return true;
    }
}