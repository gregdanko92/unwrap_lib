import mongoose, { Document, Schema } from 'mongoose';

export interface IBook extends Document {
    title: string;
    author: string;
    totalCopies: number;
    availableCopies: number;
}

const BookSchema: Schema = new Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    totalCopies: { type: Number, required: true },
    availableCopies: { type: Number, required: true }
});

export default mongoose.model<IBook>('Book', BookSchema);
