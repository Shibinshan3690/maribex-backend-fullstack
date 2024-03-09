const trycatch = (trycatchHandle) => {
    return async (req, res, next) => {
        try {
            await trycatchHandle(req, res, next)
        } catch (error) {
            console.log(error)
            res.status(500).send({staus: "Failure"})
        }
    }
    
}
 
 export default trycatch