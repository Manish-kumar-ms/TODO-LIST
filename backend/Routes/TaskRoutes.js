import express from 'express';
import { AddTask, DeleteTask, EditTask, GetAdminTasks,  getallactionlogsbyId, getallAssignedTasks, getalltasks, gettaskbyId} from '../Controller/Taskcontroller.js';
import { ensureAuthenticated } from '../Middlewares/Auth.js';


const router= express.Router()

router.post('/addtask', ensureAuthenticated, AddTask);
router.put('/edittask/:taskId', ensureAuthenticated, EditTask);
router.delete('/deletetask/:taskId', ensureAuthenticated, DeleteTask);
router.get('/getadmintask', ensureAuthenticated, GetAdminTasks);
router.get('/getalltasks', ensureAuthenticated, getalltasks);
router.get('/getallactionlogsbyId/:id', ensureAuthenticated, getallactionlogsbyId);
router.get('/gettask/:id', ensureAuthenticated, gettaskbyId);
router.get('/getallAssignedTasks', ensureAuthenticated, getallAssignedTasks);
export default router;