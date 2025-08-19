import express from 'express'
import { addTheme, deleteTheme, getTheme, updateTheme } from '../controllers/themeController.js'

const themeRoute = express.Router()

themeRoute.post('/add',addTheme)
themeRoute.get('/get',getTheme)
themeRoute.put('/update/:id', updateTheme);
themeRoute.delete('/delete/:id', deleteTheme);

export default themeRoute