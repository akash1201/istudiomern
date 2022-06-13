import express from 'express'
const router = express.Router()
import {authUri, callback, refreshAccessToken, disconnect,retrieveToken,CompanyInfo,journal, createJournalEntry, checkTokenExpiry} from '../controllers/quickBooksController.js'
router.get('/authUri',authUri)
router.get('/disconnect',disconnect)
router.get('/callback',callback)
router.get('/retrieveToken',retrieveToken)
router.get('/getCompanyInfo',CompanyInfo)
router.get('/refreshAccessToken',refreshAccessToken)
router.get('/journal',journal)
router.get('/postJournal',createJournalEntry)
router.get('/test', checkTokenExpiry)
export default router
