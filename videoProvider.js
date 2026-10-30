// Provider contract for image-to-video / text-to-video services.
// Real providers may be asynchronous: return a job ID and poll their status endpoint.
export function createVideoProvider(){
  return {
    name:'Mock Video Provider',
    async generate({prompt,format,duration,referenceUrl}){
      return {id:crypto.randomUUID(), provider:this.name, prompt, format, duration, referenceUrl,
        message:'Demo-Modus: Video-Provider-Schnittstelle ist vorbereitet. Für echte Videos API-Zugang eines Videomodells konfigurieren.'};
    }
  };
}