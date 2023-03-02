
export const ReadFileList = (files, setFiles, setError) => {
    var fileObjList = [];
    Object.values(files).map((file) => {
        let fileSize = (file.size)/Math.pow(10,6) // bytes to Megabyte conversion.
        if(fileSize <= 15){
            let promise = new Promise((resolve, reject) => {
                let fileReader = new FileReader();
                fileReader.readAsDataURL(file)
                fileReader.onload = () => {
                    let fileUrl = fileReader.result
                    let fileObj = {
                        name: file.name,
                        type: file.type,
                        size: file.size,
                        // data: fileUrl,
                        file: file
                    }
                    // console.log("File Obj: ",fileObj)
                    resolve(fileObj)
                }
                fileReader.onerror = (error) => {
                    reject(error)
                }
            })
    
            promise.then((fileObj) => {
                fileObjList.push(fileObj)
                if (fileObjList.length === files?.length) {
                    console.log('fileObjList', fileObjList)
                    setFiles(fileObjList)
                }
            }, (error) => { console.log(error) })
        }else {
            setError("File exceeds size limit of 10 MB.")
        }
        
    })
}