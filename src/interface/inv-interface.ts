

export interface IUser {
  id?: number;
  name: string;
  email: string;
  password: string;
  role: string;         // Puede ser "USER" o cualquier otro rol definido
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}




// Interface for Categoria
export interface ICategoria {
   id?: number;
  name: string;
  tipo: string;                  // TipoProducto could be "MEDICAMENTOS", "UNIFORMES", "EQUIPOS_ODONTOLOGICOS", etc.
  productos?: IProducto[];       // Optional array of associated products
  createdAt?: Date;
  updatedAt?: Date;
}

// Interface for Producto
export interface IProducto {
  id?: number;
  nombre?: string;
  descripcion?: string;          // Optional description
  codigo?: string;               // Unique code for the product
  stock: number;
  categoriaId: number;
  categoria?: ICategoria;        // Optional associated category
  tipo: string;                  // Should align with TipoProducto enum if implemented
  modificaciones?: IModificacion[]; // Optional list of modifications for the product
  createdAt?: Date;
  updatedAt?: Date;
}

// Interface for Trabajador
export interface ITrabajador {
   id?: number;
  nombre: string;
  apellido: string;
  cedula: string;                 // Unique identifier for the worker
  edad?:number;
  direccion?:string;
  oficina?:string;
  familiares?: IFamiliar[];       // Optional list of associated family members
  asignaciones?: IAsignacion[];   // Optional list of assignments
  observacion?:string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Interface for Familiar
export interface IFamiliar {
   id?: number;
  nombre: string;
  apellido: string;
  edad?:number;
  direccion?:string;
  relacion: string;               // Relation to Trabajador (e.g., child, spouse, etc.)
  trabajadorId: number;
  trabajador?: ITrabajador;       // Optional associated worker
  asignaciones?: IAsignacion[];   // Optional list of assignments involving this family member
  observacion?:string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Interface for Asignacion
export interface IAsignacion {
   id?: number;
  trabajadorId?: number;          // Optional worker ID associated with the assignment
  trabajador?: ITrabajador;       // Optional worker associated with the assignment
  familiarId?: number;            // Optional family member ID associated with the assignment
  familiar?: IFamiliar;           // Optional family member associated with the assignment
  userId: number;                 // ID of the user performing the assignment
  modificaciones?: IModificacion[]; // Optional list of modifications assigned
  observacion?:string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Interface for Modificacion
export interface IModificacion {
   id?: number;
  tipo: string;                   // Should align with TipoModificacion enum if implemented (e.g., "CREADO", "ASIGNACION")
  cantidad: number;               // Quantity modified (added or subtracted)
  entrega:string;
  productoId: number;
  producto?: IProducto;           // Optional associated product
  asignacionId: number;           // ID of the assignment linked to this modification
  asignacion?: IAsignacion;       // Optional associated assignment
  observacion?:string;
  entregado?:string;
  createdAt?: Date;
  updatedAt?: Date;
}
