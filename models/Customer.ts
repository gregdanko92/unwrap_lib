import mongoose, {Document, Schema, Types} from 'mongoose'

interface CheckedOutBook {
    bookId: Types.ObjectId,
    dueDate: Date
}

export interface ICustomer extends Document{
    name:String,
    email:String,
    checkedOutBooks: CheckedOutBook[]
}

const CustomerSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    checkedOutBooks: [{
        bookId: { type: Schema.Types.ObjectId, ref: 'Book' },
        dueDate: Date
    }]
});

export default mongoose.model<ICustomer>('Customer', CustomerSchema);
