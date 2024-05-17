const isAdmin = require("../middleware/isAdmin");
const User = require("../models/user.model");

exports.updateProfile = async (req, res) => {
    const { firstName, lastName, mobileNo, mobileNo2, state,
        district, pincode, houseNo, locality, nearbyLandmark } = req.body;

    if (req.user.userId !== req.params.id)
        return res.status(401).json({ error: "Invalid token" });

    try {
        const updateUser = await User.findByIdAndUpdate(req.params.id,
            {
                $set: {
                    firstName: firstName,
                    lastName: lastName,
                    'address.mobileNo': mobileNo,
                    'address.mobileNo2': mobileNo2,
                    'address.state': state,
                    'address.district': district,
                    'address.pincode': pincode,
                    'address.houseNo': houseNo,
                    'address.locality': locality,
                    'address.nearbyLandmark': nearbyLandmark
                }
            },
            { new: true }
        );

        res.status(200).json(updateUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.getAllUsers = async (req, res) => {
    try {
        await isAdmin(req, res);
        const allUsers = await User.find(); 
        res.status(200).json(allUsers);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.updateUserRole = async (req, res) => {

    const { id } = req.params;
    const { role } = req.body; 

    try {
        await isAdmin(req, res); 

        const updatedUser = await User.findByIdAndUpdate(id, { role }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Error updating user role:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

exports.getAgentRoleByUserId = async (req, res) => {
    try {
      const userId = req.params.id;
      
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      console.error('Error fetching user role:', error);
      res.status(500).json({ error: 'Error fetching user role' });
    }
  }