
export default function AllCourses(){
    return (
        <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
            <div className="section_heading">All courses</div>
            <div className="py-8">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {catalogPageData?.mostSellingCourses
                ?.slice(0, 4)
                .map((course, i) => (
                    <Course_Card course={course} key={i} Height={"h-[400px]"} />
                ))}
            </div>
            </div>
        </div>
    )
}