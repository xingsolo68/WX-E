import * as Yup from 'yup'
import User from '../models/User'
import JwtService from '../services/jwt.service'
import {
    BadRequestError,
    UnauthorizedError,
    ValidationError,
} from '../utils/ApiError'

export const authController = {
    login: async (req, res, next) => {
        const schema = Yup.object().shape({
            email: Yup.string().email().required(),
            password: Yup.string().required(),
        })

        if (!(await schema.isValid(req.body))) throw new ValidationError()

        let { email, password } = req.body

        const user = await User.findOne({ where: { email } })

        if (!user) throw new BadRequestError()

        if (!(await user.checkPassword(password))) throw new UnauthorizedError()

        const token = JwtService.jwtSign(user.id)

        return res.status(200).json({ user, token })
    },

    signUp: async (req, res, next) => {
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string().email().required(),
            password: Yup.string().required(),
        })

        if (!(await schema.isValid(req.body))) throw new ValidationError()

        const userExists = await User.findOne({
            where: { email: req.body.email },
        })

        if (userExists) throw new BadRequestError()

        const user = await User.create(req.body)

        const token = JwtService.jwtSign(user.id)

        return res.status(200).json({ user, token })
    },

    logout: async (req, res, next) => {
        JwtService.jwtBlacklistToken(JwtService.jwtGetToken(req))

        res.status(200).json({ msg: 'Authorized' })
    },
}
