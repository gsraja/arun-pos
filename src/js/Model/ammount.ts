class Amount {
    readonly paise_value: number;

    static from(rupee : number, paise : number = 0) {
       return new Amount(rupee * 100 + paise);
    }

    constructor(paise_value : number) {
        this.paise_value = paise_value;
    }

    get Rupee() {
        return (this.paise_value - this.Paise) / 100;
    }

    get Paise() {
        return this.paise_value % 100;
    }

    add(ammount : Amount) : Amount {
        return new Amount(this.paise_value + ammount.paise_value);
    }

    multiply(num : number) : Amount {
        return new Amount(this.paise_value * num);
    }

    roundPaise() : Amount {
        if (this.Paise < 50) {
            return new Amount(this.Rupee * 100);
        } else {
            return new Amount((this.Rupee + 1) * 100);
        }
    }

    toString() : string {
        const amount = this.paise_value / 100;
        return amount.toFixed(2);
    }
}

