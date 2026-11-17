/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface SolutionResponseDto {
  id: number;
  substanceName: string;
  description: string;
  molarConcentration: number | null;
  ph: number | null;
  imageUrl: string | null;
  videoUrl: string | null;
  likesCount: number;
  isLiked: 0 | 1;
  isCreator: 0 | 1;
}

export interface PublishSolutionDto {
  /** @maxLength 500 */
  description: string;
  /**
   * @min 0
   * @max 99.999
   */
  molarConcentration: number;
  /**
   * @min 0
   * @max 14
   */
  ph: number;
}

export interface LikeSolutionDto {
  value: 0 | 1;
}

export interface RegisterUserDto {
  /**
   * @minLength 3
   * @maxLength 50
   */
  username: string;
  /**
   * @minLength 6
   * @maxLength 72
   */
  password: string;
}

export interface UserResponseDto {
  id: number;
  username: string;
}

export interface LoginUserDto {
  username: string;
  password: string;
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title Растворы электролитов
 * @version 1.0.0
 * @contact
 *
 * REST API растворов электролитов. Сначала выполните POST /api/auth/login: сервер установит куку sessionId, и методы создателя станут доступны. Чтение (списки и лента) доступно гостю.
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  solutions = {
    /**
     * @description Опубликованные растворы с фильтром по молярной концентрации (min, max). Доступно гостю; для авторизованного пользователя заполняются признаки isCreator и isLiked.
     *
     * @tags Растворы
     * @name GetSolutionsList
     * @summary Список растворов
     * @request GET:/api/solutions
     */
    getSolutionsList: (
      query?: {
        /** @min 0 */
        min?: number;
        /** @min 0 */
        max?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<SolutionResponseDto[], any>({
        path: `/api/solutions`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Создаёт черновик от имени текущего пользователя: название, файл изображения и файл видео. Файлы сохраняются в MinIO, в БД — их имена. У пользователя может быть только один черновик.
     *
     * @tags Растворы
     * @name CreateSolutionDraft
     * @summary Создание раствора
     * @request POST:/api/solutions
     * @secure
     */
    createSolutionDraft: (
      data: {
        /** @example "Азотная кислота" */
        substanceName: string;
        /** @format binary */
        image: File;
        /** @format binary */
        video: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<SolutionResponseDto, void>({
        path: `/api/solutions`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * @description Возвращает единственный черновик пользователя; идентификатор не указывается.
     *
     * @tags Растворы
     * @name GetSolutionDraft
     * @summary Черновик текущего пользователя
     * @request GET:/api/solutions/draft
     * @secure
     */
    getSolutionDraft: (params: RequestParams = {}) =>
      this.request<SolutionResponseDto, void>({
        path: `/api/solutions/draft`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Без id возвращает первый опубликованный раствор. С id — раствор с этим id, а с параметром next=true — следующий за ним (после последнего снова первый).
     *
     * @tags Растворы
     * @name GetSolutionFeed
     * @summary Лента растворов
     * @request GET:/api/solutions/feed
     */
    getSolutionFeed: (
      id?: any,
      query?: {
        next?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<SolutionResponseDto, void>({
        path: `/api/solutions/feed`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Без id возвращает первый опубликованный раствор. С id — раствор с этим id, а с параметром next=true — следующий за ним (после последнего снова первый).
     *
     * @tags Растворы
     * @name GetSolutionFeedById
     * @summary Лента растворов
     * @request GET:/api/solutions/feed/{id}
     */
    getSolutionFeedById: (
      id?: any,
      query?: {
        next?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<SolutionResponseDto, void>({
        path: `/api/solutions/feed/${id}`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Заполняет описание, молярную концентрацию и pH и переводит черновик в опубликованные.
     *
     * @tags Растворы
     * @name PublishSolution
     * @summary Публикация раствора
     * @request PUT:/api/solutions/{id}/publish
     * @secure
     */
    publishSolution: (
      id: number,
      data: PublishSolutionDto,
      params: RequestParams = {},
    ) =>
      this.request<SolutionResponseDto, void>({
        path: `/api/solutions/${id}/publish`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Логическое удаление: статус меняется на «удалён», запись остаётся в БД.
     *
     * @tags Растворы
     * @name DeleteSolution
     * @summary Удаление раствора
     * @request DELETE:/api/solutions/{id}
     * @secure
     */
    deleteSolution: (id: number, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/api/solutions/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description value = 1 ставит лайк от текущего пользователя, value = 0 отменяет его.
     *
     * @tags Растворы
     * @name LikeSolution
     * @summary Лайк
     * @request POST:/api/solutions/{id}/like
     * @secure
     */
    likeSolution: (
      id: number,
      data: LikeSolutionDto,
      params: RequestParams = {},
    ) =>
      this.request<SolutionResponseDto, void>({
        path: `/api/solutions/${id}/like`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  users = {
    /**
     * @description Создаёт нового пользователя. Пароль хранится в виде хэша.
     *
     * @tags Пользователи
     * @name RegisterUser
     * @summary Регистрация
     * @request POST:/api/users
     */
    registerUser: (data: RegisterUserDto, params: RequestParams = {}) =>
      this.request<UserResponseDto, void>({
        path: `/api/users`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  auth = {
    /**
     * @description Проверяет логин и пароль, создаёт сессию в Redis и устанавливает куку sessionId.
     *
     * @tags Аутентификация
     * @name LoginUser
     * @summary Аутентификация
     * @request POST:/api/auth/login
     */
    loginUser: (data: LoginUserDto, params: RequestParams = {}) =>
      this.request<UserResponseDto, void>({
        path: `/api/auth/login`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Удаляет сессию из Redis и очищает куку sessionId.
     *
     * @tags Аутентификация
     * @name LogoutUser
     * @summary Деавторизация
     * @request POST:/api/auth/logout
     */
    logoutUser: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/auth/logout`,
        method: "POST",
        ...params,
      }),
  };
}
