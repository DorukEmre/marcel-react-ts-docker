const Group = require('../models/Group.model')
const User = require('../models/User.model')

async function findUserGroups(foundUser) {
  const ownedGroups = await Group.find({
    owner: foundUser.id,
  }).lean()

  const memberGroups = await Group.find({
    // both expressions need to be satisfied
    $and: [
      // owner not equal ($ne) to user.id
      { owner: { $ne: foundUser.id } },
      // members equal ($eq) to user.id, same as { members: req.user.id },
      { members: { $eq: foundUser.id } },
    ],
  }).lean()

  return { ownedGroups, memberGroups }
}

module.exports = {
  // Groups page
  getGroups: async (req, res) => {
    try {
      const foundUser = await User.findOne({ email: req.user })

      let { ownedGroups, memberGroups } = await findUserGroups(foundUser)

      res.json({ ownedGroups, memberGroups })
    } catch (err) {
      console.log(err)
    }
  },
  // Individual group page
  getGroup: (req, res) => {
    res.sendStatus(401)
  },
  createGroup: async (req, res) => {
    try {
      const foundUser = await User.findOne({ email: req.user })
      // console.log('req.body.submitData', req.body.submitData)

      const checkGroupExists = await Group.findOne({
        groupName: req.body.submitData,
      }).lean()

      if (checkGroupExists) {
        return res.status(400).json({ message: 'Group already exists' })
      } else {
        await Group.create({
          groupName: req.body.submitData,
          owner: foundUser.id,
          members: [foundUser.id],
        })
        let { ownedGroups, memberGroups } = await findUserGroups(foundUser)
        return res.status(201).json({
          ownedGroups,
          memberGroups,
          message: 'Group created successfully',
        })
      }

      // const group = await Group.find({
      //   groupName: req.body.submitData,
      // }).lean()
      // const string = encodeURIComponent(group[0].groupName)

      // res.redirect('/groups/?newgroup=' + string)
    } catch (err) {
      console.log(err)
    }
  },

  joinGroup: async (req, res) => {
    try {
      console.log('welcome to join group')
      const foundUser = await User.findOne({ email: req.user })

      const groupToJoin = await Group.findOne({
        groupName: req.body.submitData,
      }).lean()

      if (!groupToJoin)
        return res
          .status(400)
          .json({ message: 'Please check the group code is valid' })

      if (
        !groupToJoin.members.find((x) => x == foundUser.id) &&
        !groupToJoin.membersToApprove.find((x) => x == foundUser.id)
      ) {
        let pushGroup = await Group.findOneAndUpdate(
          { _id: groupToJoin._id },
          { $push: { membersToApprove: foundUser.id } },
        )
        // console.log('Request to join sent to group admin')
        return res
          .status(201)
          .json({ message: 'Request to join sent to group admin' })
      } else if (groupToJoin.members.find((x) => x == foundUser.id)) {
        // console.log('Already a member')
        return res
          .status(400)
          .json({ message: 'You are already a member of that group' })
      } else if (groupToJoin.membersToApprove.find((x) => x == foundUser.id)) {
        // console.log('Already requested')
        return res
          .status(400)
          .json({ message: 'Request to join that group is pending' })
      }
    } catch (err) {
      console.log(err)
    }
  },
}
