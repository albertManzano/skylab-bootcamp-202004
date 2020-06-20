require('nomad-commons/polyfills/string')
const { errors: { UnexistenceError } } = require('nomad-commons')
const { models: { User, Workspace } } = require('nomad-data')

module.exports = async (userId, location, filter) => { // location = [lat-lon]

    String.validate.notVoid(userId)

    const user = await User.findOne({ _id: userId })

    if (!user) throw new UnexistenceError(`user with id ${userId} does not exist`)

    let geoWorkspaces = await Workspace.find({
        geoLocation: {
            $near: {
                $geometry: {
                    type: 'Point',
                    coordinates: location,
                },
            },
        },
    })
    if (!geoWorkspaces.length) throw new Error("No workspaces near you")

    if (filter) geoWorkspaces = geoWorkspaces.filter(({ category }) => category === filter)
    console.log(geoWorkspaces)

    return geoWorkspaces.slice(0, 20)
}

