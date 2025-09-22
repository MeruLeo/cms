import { NextFunction, Request, Response } from "express";
import * as categoryService from "../../services/categories/category";
import {
  categoryCreateSchema,
  categoryUpdateSchema,
} from "../../validators/categories/category";
import { AppError } from "../../middlewares/errorHandler";

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = categoryCreateSchema.safeParse(req.body);
    if (!parsed.success) {
      const errors = parsed.error.issues.map(
        (i) => `${i.path.join(".")}: ${i.message}`
      );
      return next(new AppError(errors.join(", "), 400));
    }
    const category = await categoryService.createCategory(parsed.data);
    res.status(201).json({ ok: true, data: category });
  } catch (err) {
    next(err);
  }
}

export async function getAll(req: Request, res: Response, next: NextFunction) {
  try {
    const { parent, isActive } = req.query;
    const categories = await categoryService.getCategories({
      parent: parent ? String(parent) : undefined,
      isActive: isActive !== undefined ? isActive === "true" : undefined,
    });
    res.json({ ok: true, data: categories });
  } catch (err: any) {
    next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const category = await categoryService.getCategoryById(id);
    if (!category)
      return res.status(404).json({ ok: false, message: "Category not found" });
    res.json({ ok: true, data: category });
  } catch (err: any) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const parsed = categoryUpdateSchema.parse(req.body);
    const updated = await categoryService.updateCategory(id, parsed);
    if (!updated)
      return res.status(404).json({ ok: false, message: "Category not found" });
    res.json({ ok: true, data: updated });
  } catch (err: any) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    await categoryService.deleteCategory(id);
    res.json({ ok: true, message: "Category successfully deleted" });
  } catch (err: any) {
    next(err);
  }
}
