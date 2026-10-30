// Provider contract: replace this adapter with a real image API implementation.
// Keep credentials server-side. The demo intentionally returns a clearly labelled placeholder.
export function createImageProvider(){
  return {
    name:'Mock Image Provider',
    async generate({prompt,format,style}){
      return {id:crypto.randomUUID(), provider:this.name, prompt, format, style,
        previewUrl:null, message:'Demo-Modus: Provider-Schnittstelle ist vorbereitet. Für echte Generierung muss ein Bildanbieter mit API-Key angebunden werden.'};
    }
  };
}