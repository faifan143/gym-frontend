// constants/messages.ts
export const SUCCESS_MESSAGES = {
  CREATE_TRAINER: "تم إضافة المدرب بنجاح",
  UPDATE_TRAINER: "تم تحديث بيانات المدرب بنجاح",
  DELETE_TRAINER: "تم حذف المدرب بنجاح",
  CREATE_NUTRITIONIST: "تم إضافة أخصائي التغذية بنجاح",
  UPDATE_NUTRITIONIST: "تم تحديث بيانات أخصائي التغذية بنجاح",
  DELETE_NUTRITIONIST: "تم حذف أخصائي التغذية بنجاح",
  CREATE_SUBSCRIPTION: "تم إضافة الاشتراك بنجاح",
  UPDATE_SUBSCRIPTION: "تم تحديث الاشتراك بنجاح",
  DELETE_SUBSCRIPTION: "تم حذف الاشتراك بنجاح",
  CREATE_SPECIALTY: "تم إضافة التخصص بنجاح",
  UPDATE_PASSWORD: "تم تحديث كلمة المرور بنجاح",
  UPDATE_NAME: "تم تحديث الاسم بنجاح",
  DETACH_EXPIRED: "تم إلغاء الاشتراكات المنتهية بنجاح",
};

export const ERROR_MESSAGES = {
  CREATE_TRAINER: "حدث خطأ أثناء إضافة المدرب",
  UPDATE_TRAINER: "حدث خطأ أثناء تحديث بيانات المدرب",
  DELETE_TRAINER: "حدث خطأ أثناء حذف المدرب",
  CREATE_NUTRITIONIST: "حدث خطأ أثناء إضافة أخصائي التغذية",
  UPDATE_NUTRITIONIST: "حدث خطأ أثناء تحديث بيانات أخصائي التغذية",
  DELETE_NUTRITIONIST: "حدث خطأ أثناء حذف أخصائي التغذية",
  CREATE_SUBSCRIPTION: "حدث خطأ أثناء إضافة الاشتراك",
  UPDATE_SUBSCRIPTION: "حدث خطأ أثناء تحديث الاشتراك",
  DELETE_SUBSCRIPTION: "حدث خطأ أثناء حذف الاشتراك",
  CREATE_SPECIALTY: "حدث خطأ أثناء إضافة التخصص",
  UPDATE_PASSWORD: "حدث خطأ أثناء تحديث كلمة المرور",
  UPDATE_NAME: "حدث خطأ أثناء تحديث الاسم",
  DETACH_EXPIRED: "حدث خطأ أثناء إلغاء الاشتراكات المنتهية",
  VALIDATION: {
    REQUIRED_NAME: "يرجى إدخال اسم أخصائي التغذية",
    REQUIRED_SPECIALTY: "يرجى اختيار التخصص",

    REQUIRED_FIELDS: "يرجى ملء جميع الحقول المطلوبة",
    INVALID_EMAIL: "البريد الإلكتروني غير صالح",
    INVALID_PASSWORD: "كلمة المرور غير صالحة",
    INVALID_COST: "يجب أن تكون التكلفة أكبر من صفر",
  },
};

export const formatDate = (date: Date): string => {
  return new Date(date).toLocaleString("ar", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
