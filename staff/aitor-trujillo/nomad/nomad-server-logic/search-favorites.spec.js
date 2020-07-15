require('dotenv').config()

const { env: { TEST_MONGODB_URL: MONGODB_URL } } = process

const searchFavorites = require('./retrieve-favorites')
const { random } = Math
const { expect } = require('chai')
require('nomad-commons/polyfills/json')
const { mongoose, models: { Workspace, User } } = require('nomad-data')

describe('logic - search in user favorites', () => {
    before(() => mongoose.connect(MONGODB_URL))

    let workspaceRandom = {}
    let userName, surname, email, password, userId
    let workspaceId


    beforeEach(async () => {

        await Workspace.deleteMany()
        await User.deleteMany()
            .then(() => {
                userName = `name-${random()}`
                surname = `surname-${random()}`
                email = `e-${random()}@mail.com`
                password = `password-${random()}`
            })


        await User.create({ name: userName, surname, email, password })
            .then(({ id }) => {
                userId = id
            })

        workspaceRandom = {
            creator: userId,
            name: `name-${random()}`,
            category: 'cowork',
            price: { amount: random() + 100, term: 'month' },
            address: { street: `${random()} st`, city: `${random()} city`, country: `${random()} country` },
            geoLocation: { coordinates: [random(), random()] },
            photos: [`photo-${random()}`],
            phone: `phone-${random()}`,
            features: { wifi: false, parking: false, coffee: true, meetingRooms: false },
            description: `description-${random()}`,
            capacity: random(),
        }

        const workspace = await Workspace.create(workspaceRandom)

        workspaceId = workspace.id

        const user = await User.findById(userId)
        user.favorites.push(workspaceId)
        await user.save()
        return


    })

    it('should succeed on valid workspaceId', async () => {
        const result = await searchFavorites(userId, 'name')

        expect(result).to.exist

        const [workspace] = result

        expect(workspace.name).to.equal(workspaceRandom.name)
        expect(workspace.category).to.equal(workspaceRandom.category)
        expect(workspace.price.amount).to.equal(workspaceRandom.price.amount)
        expect(workspace.price.term).to.equal(workspaceRandom.price.term)
        expect(workspace.address.street).to.equal(workspaceRandom.address.street)
        expect(workspace.address.city).to.equal(workspaceRandom.address.city)
        expect(workspace.address.country).to.equal(workspaceRandom.address.country)
        expect(workspace.geoLocation.coordinates[0]).to.equal(workspaceRandom.geoLocation.coordinates[0])
        expect(workspace.photos[0]).to.equal(workspaceRandom.photos[0])
        expect(workspace.features.wifi).to.equal(workspaceRandom.features.wifi)
        expect(workspace.features.parking).to.equal(workspaceRandom.features.parking)
        expect(workspace.features.coffee).to.equal(workspaceRandom.features.coffee)
        expect(workspace.features.meetingRooms).to.equal(workspaceRandom.features.meetingRooms)
        expect(workspace.description).to.equal(workspaceRandom.description)
        expect(workspace.capacity).to.equal(workspaceRandom.capacity)
    })

    afterEach(() => User.deleteMany().then(() => Workspace.deleteMany()))

    after(mongoose.disconnect)
})