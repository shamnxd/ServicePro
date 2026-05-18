import { Model, Document } from "mongoose";
import { IBaseRepository } from "../../interfaces/repositories/IBaseRepository";

export abstract class BaseRepository<TDocument extends Document, TEntity> implements IBaseRepository<TEntity> {
  protected constructor(
    protected readonly model: Model<TDocument>
  ) {}

  protected abstract toDomain(doc: TDocument): TEntity;

  public async create(item: Partial<TEntity>): Promise<TEntity> {
    const createdDoc = new this.model(item);
    const savedDoc = await createdDoc.save();
    return this.toDomain(savedDoc);
  }

  public async findById(id: string): Promise<TEntity | null> {
    const doc = await this.model.findById(id).exec();
    return doc ? this.toDomain(doc) : null;
  }

  public async findAll(): Promise<TEntity[]> {
    const docs = await this.model.find().exec();
    return docs.map(doc => this.toDomain(doc));
  }

  public async update(id: string, item: Partial<TEntity>): Promise<TEntity | null> {
    const updatedDoc = await this.model.findByIdAndUpdate(
      id,
      item as any, // Cast to any to bypass strict partial mongoose document validation conflicts
      { new: true }
    ).exec();
    return updatedDoc ? this.toDomain(updatedDoc) : null;
  }

  public async delete(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id).exec();
    return result !== null;
  }
}
