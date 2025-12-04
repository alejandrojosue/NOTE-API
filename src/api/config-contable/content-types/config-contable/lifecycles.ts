// path: src/api/config-contable/content-types/config-contable/lifecycles.ts

export default {
  /**
   * Triggered before creating an entry.
   */
  async beforeCreate(event) {
    const { data } = event.params;

    // Ejemplo: agregar fecha o validar datos
    // data.codigo = data.codigo?.toUpperCase();

    // console.log("beforeCreate -> data:", data);
  },

  /**
   * Triggered after creating an entry.
   */
  async afterCreate(event) {
    const { result } = event;

    console.log("afterCreate -> result:", result);
  },

  /**
   * Triggered before updating an entry.
   */
  async beforeUpdate(event) {
    const { data, where } = event.params;

    // Ejemplo: asegurarse que algo no cambie
    // if (data.codigo) delete data.codigo;

    // console.log("beforeUpdate", { data, where });
  },

  /**
   * Triggered after updating an entry.
   */
  async afterUpdate(event) {
    const { result } = event;

    console.log("afterUpdate -> result:", result);

    const userUpdated = result.updatedBy;

    
  },

  /**
   * Triggered before deleting an entry.
   */
  async beforeDelete(event) {
    const { where } = event.params;

    // console.log("beforeDelete", where);
  },

  /**
   * Triggered after deleting an entry.
   */
  async afterDelete(event) {
    const { result } = event;

    // console.log("afterDelete -> deleted entry:", result);
  },
};
