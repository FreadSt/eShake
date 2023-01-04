import { SERVER_URL } from "../constants";

export const handleGetAvatarFile = (type, filename) => {
  let filetype;
  const token = localStorage.getItem('access-token')
  if (type && filename) {
    // eslint-disable-next-line default-case
    switch(filename?.split('.')[1]){
      case 'pdf':
        filetype = 'application/pdf';
        break;
      case 'jpg':
        filetype = 'image/jpeg';
        break;
      case 'png':
        filetype = 'image/png';
        break;
      case 'tiff':
        filetype = 'image/tiff';
        break;
    }
    return fetch(`${SERVER_URL}/user/file`, {
      method: `POST`,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'access-token': token && token,
        'Access-Control-Allow-Origin': '*',
        Accept: '/',
      },
      body: JSON.stringify({type, filename})
    })
      .then( res => {
        return res.arrayBuffer()
      })
      .then( ab => {
        return URL.createObjectURL( new Blob( [ab], {type: filetype}))
      })
      .catch( console.error );
  }
}
