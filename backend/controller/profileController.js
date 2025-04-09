import User from '../model/userModel.js';

export const getUserProfile = async(req,res) => {

    const userId = req.user.userId;
    // console.log(userId);
    

    try {
        const result = await User.findById(userId)

        if (result.length === 0) {
            return res.status(404).json({ error: 'User not found' });
          }

        return res.json({ result });
    } catch (error) {
        console.error('Error executing query:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export const updatePhone =  async(req,res) => {
    const userId = req.user.userId;
    const { phone } = req.body;
    try {
        await User.updatePhoneNumber(userId , phone );
        return res.json({ message: 'Phone updated successfully' });
    } catch (error) {
        console.error('Error executing query:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}