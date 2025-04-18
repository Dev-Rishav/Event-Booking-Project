import Admin from "../model/AdminModel.js";

export const getAllUsers = async(req,res) => {
    try {
        const result = await Admin.getAllUsers();
        if(!result){
            return res.status(401).json({ error: "No users available" });
        }
        return res.status(201).json({ msg: "All the users are : " , result});
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getAllOrganizers = async(req,res) => {
    try {
        const result = await Admin.getAllOrganizers();
        if(!result){
            return res.status(401).json({ error: "No Organizers available" });
        }
        return res.status(201).json({ msg: "All the Organizers are : " , result});
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getUserbyEmail = async(req,res) => {
    try {
        const email = req.params.id;
        const result = await Admin.getUserbyEmail(email);
        if(!result){
            return res.status(401).json({ error: "No user available" });
        }
        return res.status(201).json({ msg: "All the user deatils are : " , result});
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}

