interface StatCardProps {
  title: string;
  value: string | number;
}


export default function StatCard({
  title,
  value,
}: StatCardProps) {

  return (

    <div
      className="
        bg-card
        border
        border-border
        rounded-2xl
        p-6
        shadow-sm
        hover:shadow-md
        transition
      "
    >


      <div className="
        flex
        items-center
        justify-between
      ">


        <p
          className="
            text-sm
            font-medium
            text-muted-foreground
          "
        >
          {title}
        </p>


        <div
          className="
            h-3
            w-3
            rounded-full
            bg-primary
          "
        />

      </div>




      <h2
        className="
          mt-4
          text-3xl
          font-bold
          text-foreground
        "
      >
        {value}
      </h2>




      <div
        className="
          mt-4
          h-1
          w-full
          rounded-full
          bg-primary/20
        "
      >

        <div
          className="
            h-1
            w-2/3
            rounded-full
            bg-primary
          "
        />

      </div>



    </div>

  );

}