import data from '../../data.json'
function Funny(){
    return(
        <>
        <div>
        {
            data.map((item, i)=>{
                // console.log(item)
                return(
                    <div key={i}>
                        <h4>{item.name}</h4>
                        <h4>{item.squad}</h4>
                        <h4>{item.email}</h4>
                        <h4>{item.github}</h4>
                    </div>
                )
            })
        }
        </div>
        </>
    )

}

export default Funny