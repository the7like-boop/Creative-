import express from 'express';
import cors from 'cors';
import multer from 'multer';
import dotenv from 'dotenv';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createImageProvider } from './providers/imageProvider.js';
import { createVideoProvider } from './providers/videoProvider.js';
dotenv.config();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = process.env.PORT || 8787;
const storageDir = path.resolve(process.env.STORAGE_DIR || './storage');
fs.mkdirSync(storageDir, {recursive:true});
app.use(cors());
app.use(express.json({limit:'2mb'}));
app.use('/uploads', express.static(storageDir));
const upload = multer({dest:storageDir, limits:{fileSize:20*1024*1024}, fileFilter:(_,f,cb)=>cb(null, /^image\\/(png|jpeg|webp)$/.test(f.mimetype))});
const imageProvider = createImageProvider();
const videoProvider = createVideoProvider();
app.get('/api/health', (_,res)=>res.json({ok:true, imageProvider:imageProvider.name, videoProvider:videoProvider.name, mode:'development'}));
app.post('/api/upload', upload.single('reference'), (req,res)=>{
  if(!req.file) return res.status(400).json({error:'Bitte eine PNG-, JPG- oder WEBP-Datei bis 20 MB hochladen.'});
  res.json({id:req.file.filename, name:req.file.originalname, url:`/uploads/${req.file.filename}`, mimeType:req.file.mimetype});
});
app.post('/api/generate/image', async (req,res)=>{
  try {
    const {prompt, format='9:16', style='Photorealistisch'} = req.body || {};
    if(!prompt?.trim()) return res.status(400).json({error:'Bitte einen Prompt eingeben.'});
    const result = await imageProvider.generate({prompt,format,style});
    res.json({...result, status:'completed', demo:imageProvider.name==='Mock Image Provider'});
  } catch(e) {res.status(500).json({error:e.message || 'Bildgenerierung fehlgeschlagen.'});}
});
app.post('/api/generate/video', async (req,res)=>{
  try {
    const {prompt, format='9:16', duration=10, referenceUrl=null} = req.body || {};
    if(!prompt?.trim()) return res.status(400).json({error:'Bitte einen Prompt eingeben.'});
    if(!Number.isFinite(Number(duration)) || duration<1 || duration>15) return res.status(400).json({error:'Die Videolänge muss zwischen 1 und 15 Sekunden liegen.'});
    const result = await videoProvider.generate({prompt,format,duration:Number(duration),referenceUrl});
    res.json({...result, status:'queued', demo:videoProvider.name==='Mock Video Provider'});
  } catch(e) {res.status(500).json({error:e.message || 'Videogenerierung fehlgeschlagen.'});}
});
app.use(express.static(path.resolve(__dirname,'../dist')));
app.get('*',(req,res)=>res.sendFile(path.resolve(__dirname,'../dist/index.html')));
app.listen(port,()=>console.log(`AI Creative Studio API läuft auf http://localhost:${port}`));