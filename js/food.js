class Food{
    constructor(){
        this.foodStock;
        this.lastFed;
        this.image = loadImage("images/Food Stock.png");
    }

    getFoodStock(){
        var foodStockRef = database.ref("Food/foodLeft");
        foodStockRef.on("value", function(data){
            this.foodStock = data.val();
        })
    }

    updateFoodStock(stock){
        var foodStockRef = database.ref("Food/");
        foodStockRef.update({
            foodLeft: stock
        })
    }

    display(){
        var x = 80, y = 100;

        imageMode(CENTER);

        if(foodS !== null){
            for(var i = 0; i < foodS; i++){
                if(i % 10 === 0){
                    x = 60;
                    y = y + 100;
                }
                image(this.image, x, y, 50, 50);
                x = x + 50;
            }
        }
    }
}