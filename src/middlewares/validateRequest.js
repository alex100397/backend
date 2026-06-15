export const validateRequest = (schema) => {
    return (req, res, next) => {
        const validation = schema.safeParse(req.body);
        if (!validation.success) {
            const formatted = validation.error.format();
            const flatError = Object.values(formatted).flatMap(field => field._errors);
            const error = flatError.join(', ')
            return res.status(400).json({ message: error });
        }
        next();
    }
}