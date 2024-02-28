const mongo = require ("mongoose");
const Schema =mongo.Schema 
const typeIntrvEnum = ["En ligne","En face"];
const statusIntrvEnum =["En attente","Terminé"]
const Interview = new Schema(
    {
        title: String ,
        descrInter : String,
        dateInterv: Date ,
        address : String ,
        typeIntrv : {
            type : String ,
            enum : typeIntrvEnum ,
            default : "En ligne"
        },
        statusInterv : {
            type : String ,
            enum : statusIntrvEnum ,
            default : "En attente"
        }
    }
)

module.exports = mongo.model("interview", Interview) ;