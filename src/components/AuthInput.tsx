type Props = {
  label: string;
  placeholder: string;
  value: string;
  onChangeFather: (value: string) => void;
  type?: string;
  error?: string;
};

export default function AuthInput({
  label,
  placeholder,
  value,
  onChangeFather,
  type = "text",
  error,
}: Props) {

  return (
    <div className="space-y-2">

      <label
        className="
        block 
        text-sm 
        font-medium 
        text-gray-700
        "
      >
        {label}
      </label>


      <input
        type={type}
        value={value}
        onChange={(e) => onChangeFather(e.target.value)}
        placeholder={placeholder}
        className={`
          w-full
          rounded-xl
          border
          px-4
          py-3
          text-sm
          text-gray-900
          placeholder:text-gray-400
          outline-none
          transition-all
          duration-200

          ${
            error
              ? "border-red-400 focus:border-red-500 focus:ring-red-100"
              : "border-gray-200 focus:border-black focus:ring-4 focus:ring-gray-100"
          }
        `}
      />


      {
        error && (
          <p className="
            text-xs
            text-red-500
          ">
            {error}
          </p>
        )
      }

    </div>
  );
}