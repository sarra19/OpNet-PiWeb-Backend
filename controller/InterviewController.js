const Interview = require("../models/interview");

async function add(req, res){
    try{
    const intrv = new Interview(req.body)
    await intrv.save();
    res.status(200).send("add good")
    }catch(err){
        res.status(400).send(err);
        console.log(err);
    }
}
async function getall(req,res){
    try{
        const data=await Interview.find();
        res.status(200).send(data);
    }catch(err){
        res.status(400).send(err);
    }
}

async function getbyid (req , res){
    try{
        const data = await Interview.findById(req.params.id);
        res.status(200).send(data);
    }catch(err){
        res.status(400).send(err);
    }
}


async function getbytitle(req,res){
    try{
        let title = req.params.title ;
        const datatitle = await Interview.findOne({ title }) ;
        res.status(200).send(datatitle);
    }catch(err){
        res.status(400).send(err);
    }
}

async function update(req ,res){
    try{
        await Interview.findByIdAndUpdate(req.params.id , req.body);
        res.status(200).send("updated");
    }catch(err){
        res.status(400).send(err);
    }
}

async function deleteinterview(req,res){
    try{
        await Interview.findByIdAndDelete(req.params.id);
        res.status(200).send("deleted");
    }catch(err){
        res.status(400).send(err);
    }
}

module.exports={add , getall ,getbyid ,getbytitle, update, deleteinterview}