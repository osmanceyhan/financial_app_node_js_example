import mongoose, { Document, Schema } from 'mongoose';

export interface IRefreshToken extends Document {
    user: mongoose.Schema.Types.ObjectId;
    token: string;
    expires: Date;
    created: Date;
    createdByIp: string;
    revoked?: Date;
    revokedByIp?: string;
    replacedByToken?: string;
    isActive: boolean;
}

const refreshTokenSchema = new Schema<IRefreshToken>({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    token: { type: String, required: true },
    expires: { type: Date, required: true },
    created: { type: Date, default: Date.now },
    createdByIp: { type: String, required: true },
    revoked: { type: Date },
    revokedByIp: { type: String },
    replacedByToken: { type: String },
    isActive: {
        type: Boolean,
        default: true,
        get: function (this: IRefreshToken, value: boolean): boolean {
            return value && !this.revoked && Date.now() < this.expires.getTime();
        }
    }
}, { toJSON: { getters: true } });

const RefreshToken = mongoose.model<IRefreshToken>('RefreshToken', refreshTokenSchema);
export default RefreshToken;
