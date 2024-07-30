import { Uuid } from "../../../shared/domain/value-objects/uuid.vo";
import { Category } from "../category.entity";

describe("Category Unit Tests", () => {
  let validateSpy: any;
  beforeEach(() => {
    validateSpy = jest.spyOn(Category, "validate");
  });
  describe("create command", () => {
    test("should create a category", () => {
      const category = Category.create({
        name: "Movie",
      });
      expect(category.category_id).toBeInstanceOf(Uuid);
      expect(category.name).toBe("Movie");
      expect(category.description).toBeNull();
      expect(category.is_active).toBeTruthy();
      expect(category.created_at).toBeInstanceOf(Date);
      expect(validateSpy).toHaveBeenCalledTimes(1);
    });

    test("should create a category with is active", () => {
      const created_at = new Date();
      const category = Category.create({
        name: "Movie",
        is_active: false,
      });
      expect(category.category_id).toBeInstanceOf(Uuid);
      expect(category.name).toBe("Movie");
      expect(category.is_active).toBeFalsy();
      expect(validateSpy).toHaveBeenCalledTimes(1);
    });

    test("should create a category with a name and description", () => {
      const category = Category.create({
        name: "Movie",
        description: "Movie description",
      });
      expect(category.category_id).toBeInstanceOf(Uuid);
      expect(category.name).toBe("Movie");
      expect(category.description).toBe("Movie description");
      expect(category.is_active).toBeTruthy();
      expect(category.created_at).toBeInstanceOf(Date);
      expect(validateSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("category_id field", () => {
    const arrange = [
      { category_id: null },
      { category_id: undefined },
      { category_id: new Uuid() },
    ];

    test.each(arrange)("id = %j", ({ category_id }) => {
      const category = new Category({
        name: "Movie",
        category_id: category_id as any,
      });
      expect(category.category_id).toBeInstanceOf(Uuid);
      if (category_id instanceof Uuid) {
        expect(category.category_id).toEqual(category_id);
      }
    });
  });

  describe("other methods", () => {
    test("should change name", () => {
      const category = Category.create({
        name: "Movie",
      });
      category.changeName("Movie 2");
      expect(category.name).toBe("Movie 2");
      expect(validateSpy).toHaveBeenCalledTimes(2);
    });

    test("should change description", () => {
      const category = Category.create({
        name: "Movie",
      });
      category.changeDescription("Movie description");
      expect(category.description).toBe("Movie description");
      expect(validateSpy).toHaveBeenCalledTimes(2);
    });

    test("should activate category", () => {
      const category = Category.create({
        name: "Movie",
      });
      category.activate();
      expect(category.is_active).toBeTruthy();
    });

    test("should deactivate category", () => {
      const category = Category.create({
        name: "Movie",
        is_active: true,
      });
      category.deactivate();
      expect(category.is_active).toBeFalsy();
    });
  });
});

describe("Category Validator", () => {
  describe("create command", () => {
    test("should an invalid category with name property", () => {
      expect(() => Category.create({ name: null })).containsErrorMessages({
        name: [
          "name should not be empty",
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ],
      });

      expect(() => Category.create({ name: "" })).containsErrorMessages({
        name: ["name should not be empty"],
      });

      expect(() => Category.create({ name: 5 as any })).containsErrorMessages({
        name: [
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ],
      });

      expect(() =>
        Category.create({ name: "t".repeat(256) })
      ).containsErrorMessages({
        name: ["name must be shorter than or equal to 255 characters"],
      });
    });

    it("should an invalid category with description property", () => {
      expect(() =>
        Category.create({ description: 5 } as any)
      ).containsErrorMessages({
        description: ["description must be a string"],
      });
    });

    it("should an invalid category with is_active property", () => {
      expect(() =>
        Category.create({ name: "Movie", is_active: 5 as any })
      ).containsErrorMessages({
        is_active: ["is_active must be a boolean value"],
      });
    });

    it("should valid category", () => {
      expect(Category.create({ name: "Movie" })).toBeInstanceOf(Category);
    });
  });

  describe("changeDescription method", () => {
    it("should change description", () => {
      const category = Category.create({ name: "Movie" });
      category.changeDescription("Movie description");
      expect(category.description).toBe("Movie description");
    });
  });

  describe("changeName method", () => {
    it("should change name", () => {
      const category = Category.create({ name: "Movie" });
      category.changeName("Movie 2");
      expect(category.name).toBe("Movie 2");
    });
  });
});
