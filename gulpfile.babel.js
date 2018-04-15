import path from "path";
import gulp from "gulp";
import babel from "gulp-babel";

gulp.task("build", ["build-js"]);

gulp.task("build-js", () =>
{
	const src = path.resolve("src", "**", "*.es");
	const dist = path.resolve("dist");

	return gulp.src(src)
		.pipe(babel())
		.pipe(gulp.dest(dist));
});

gulp.task("watch", ["watch-gulpfile", "watch-js"]);

gulp.task("watch-gulpfile", () =>
{
	const target = "gulpfile.babel.js";
	const tasks = ["build"];
	return gulp.watch(target, tasks);
});

gulp.task("watch-js", () =>
{
	const target = path.resolve("src", "**", "*.es");
	const tasks = ["build-js"];
	return gulp.watch(target, tasks);
});
