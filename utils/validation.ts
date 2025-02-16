

export const validatePasswordLength = (password: string): boolean => {
    return password.length >= 8;
};

export const validatePasswordContainsNumbers = (password: string): boolean => {
    return /\d/.test(password);
};

export const validatePasswordContainsUppercase = (password: string): boolean => {
    return /[A-Z]/.test(password);
};

export const validatePasswordContainsLowercase = (password: string): boolean => {
    return /[a-z]/.test(password);
};

export const validatePasswordContainsSpecialCharacters = (password: string): boolean => {
    return /[!@#$%^&*]/.test(password);
};

export const validatePassword = (password: string): string => {
    const validations = [
        {
            validate: validatePasswordLength,
            message: 'A jelszónak minimum 8 karakterből kell állnia!'
        },
        {
            validate: validatePasswordContainsNumbers,
            message: 'A jelszónak legalább egy számot kell tartalmaznia!'
        },
        {
            validate: validatePasswordContainsUppercase,
            message: 'A jelszónak legalább egy nagybetűt kell tartalmaznia!'
        },
        {
            validate: validatePasswordContainsLowercase,
            message: 'A jelszónak legalább egy kisbetűt kell tartalmaznia!'
        },
        {
            validate: validatePasswordContainsSpecialCharacters,
            message: 'A jelszónak legalább egy speciális karaktert kell tartalmaznia!'
        }
    ];

    for (const { validate, message } of validations) {
        if (!validate(password)) {
            return message;
        }
    }
    return '';
};

export const validateEmail = (email: string): string => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return 'Érvényes email címet adj meg!';
    }
    return '';
};


