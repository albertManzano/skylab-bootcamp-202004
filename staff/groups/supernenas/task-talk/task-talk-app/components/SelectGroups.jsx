function SelectGroups ({userGroups, toSelectedGroup}) {

    function handleToActivities(id){
        toSelectedGroup(id)
    }

    return <section className="group__card group__card--preview">
        {
            userGroups.length ? 
            <ul> {
                userGroups.map((group) => {
                    return <CardPreview id={group.id} title={group.name} message={group.desc} toEdit={handleToActivities}/>
                    })
                }
            </ul>
            : <Feedback message='sorry, no results' level='warning'/>
        }
    </section>
}
