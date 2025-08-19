import Theme from "../models/Theme.js"


export const addTheme=async(req,res)=>{
    const {name} = req.body
    if (!name) {
        return res.status(400).json({
            success: false,
            message: "Name is required"
        })
    }
    try {

        const existingTheme = await Theme.findOne({name})

        if (existingTheme) {
            return res.status(409).json({ msg: 'Theme already exists' })
        }
        
        const newTheme = await Theme.create({
            name
        })

        res.status(201).json({
            success: true,
            theme:newTheme
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'server error'
        })
    }
}

export const getTheme=async(req,res)=>{
    try {

        const theme = await Theme.find()

        res.status(200).json({
            success: true,
            theme
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'server error'
        })
    }
}

export const updateTheme = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({
            success: false,
            message: "Name is required",
        });
    }

    try {
        const updated = await Theme.findByIdAndUpdate(
            id,
            { name },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ success: false, message: "Theme not found" });
        }

        res.status(200).json({ success: true, theme: updated });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
}

export const deleteTheme = async (req, res) => {
    const { id } = req.params;

    try {
        const deleted = await Theme.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({ success: false, message: "Theme not found" });
        }

        res.status(200).json({ success: true, message: "Theme deleted" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
}